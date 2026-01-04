"use client";
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { WalleeAiOrgMapIdentityOrganizationUnitsDtosOrganizationUnitDto } from "@/openapi";
import { useAllOrganizationUnits } from "@/hooks/identity/organization-units/use-all-organization-units";
import { AmapAroundSearch } from "@/components/mobile/ai/amap/prompts/amap-around-search";

// 修复 Leaflet 默认图标问题
const markerIcon = L.icon({
  iconUrl: "/map/marker-icon.png",
  iconRetinaUrl: "/map/marker-icon-2x.png",
  shadowUrl: "/map/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const branchIcon = L.icon({
  iconUrl: "/map/branch-icon.png",
  iconRetinaUrl: "/map/branch-icon-2x.png",
  shadowUrl: "/map/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultActivatedMarker: MarkerPoint = {
  id: "init-marker",
  position: { lng: 109.859957, lat: 40.655194 },
  name: "包头分行",
};

type Position = { lng: number; lat: number };

type MarkerPoint = {
  id: string;
  position: Position;
  name: string;
};
// 自定义组件来更新地图中心
function MapCenterUpdater(position: Position | null | undefined) {
  const map = useMap();
  if (position?.lng && position?.lat) {
    map.setView({ lat: position.lat, lng: position.lng }, map.getZoom());
  } else {
    map.setView(defaultActivatedMarker.position, map.getZoom());
    return null;
  }
}

// 地图点击事件处理组件
function MapClickHandler({
  onMapClick,
}: {
  onMapClick?: (marker: MarkerPoint | null) => void;
  onPositionChange?: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click: (e) => {
      onMapClick?.({
        id: "clicked-marker",
        position: { lng: e.latlng.lng, lat: e.latlng.lat },
        name: "选中位置",
      });
    },
  });

  return null;
}

// 监听容器尺寸变化以强制刷新地图尺寸，避免父容器调整高度后显示异常
function ResizeInvalidator() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}

export default function MapComponent() {
  const { data: organizationUnits, isLoading } = useAllOrganizationUnits();
  const [activeMarker, setActiveMarker] = useState<MarkerPoint | null>(
    defaultActivatedMarker
  );
  const markers: MarkerPoint[] = useMemo(
    () =>
      (organizationUnits?.items || [])
        .map(
          (
            unit: WalleeAiOrgMapIdentityOrganizationUnitsDtosOrganizationUnitDto
          ) => {
            const coordinate = unit.extraProperties?.Coordinate as string;
            if (!coordinate) return null;
            const [lng, lat] = coordinate.split(",").map(Number);
            if (isNaN(lat) || isNaN(lng)) return null;
            return {
              id: unit.id || `${lng}-${lat}`,
              position: { lng, lat },
              name: unit.displayName || "未命名机构",
            } satisfies MarkerPoint;
          }
        )
        .filter(Boolean) as MarkerPoint[],
    [organizationUnits]
  );

  return (
    <MapContainer
      center={activeMarker?.position}
      zoom={13}
      className="w-full h-full rounded-lg shadow-inner z-0"
      zoomControl={false} // 禁用默认缩放控件
      dragging={true}
      touchZoom={true}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://amap.com">高德地图</a>'
        url="https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
        subdomains={["1", "2", "3", "4"]}
      />

      {!isLoading &&
        markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{
              lng: marker?.position.lng as number,
              lat: marker?.position.lat as number,
            }}
            icon={branchIcon}
            eventHandlers={{
              click: () => {
                setActiveMarker(marker);
              },
            }}
          >
            <Popup position={marker.position} key={marker.id}>
              <AmapAroundSearch
                name={marker.name || ""}
                lng={marker.position.lng as number}
                lat={marker.position.lat as number}
              />
            </Popup>
          </Marker>
        ))}

      {activeMarker && (
        <Marker
          key={activeMarker.id}
          position={{
            lng: activeMarker?.position.lng as number,
            lat: activeMarker?.position.lat as number,
          }}
          icon={markerIcon}
          eventHandlers={{
            click: () => {
              setActiveMarker(activeMarker);
            },
          }}
        >
          <Popup
            position={activeMarker.position}
            key={activeMarker.id}
          >
            <AmapAroundSearch
              name={activeMarker.name || ""}
              lng={activeMarker.position.lng as number}
              lat={activeMarker.position.lat as number}
            />
          </Popup>
        </Marker>
      )}

      <MapCenterUpdater
        lng={activeMarker?.position.lng as number}
        lat={activeMarker?.position.lat as number}
      />
      <MapClickHandler onMapClick={(e) => setActiveMarker(e)} />
      <ResizeInvalidator />
    </MapContainer>
  );
}
