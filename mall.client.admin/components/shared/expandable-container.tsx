import * as React from "react"
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

type ExpandableContainerProps = {
  collapsedMaxHeight?: number
  defaultOpen?: boolean
  /** 是否允许“收起”（展开后显示收起按钮） */
  allowCollapse?: boolean
  /** 浮动“展开”按钮距离底部的偏移 */
  expandButtonBottom?: number
  children: React.ReactNode
}

export function ExpandableContainer({
  collapsedMaxHeight = 240,
  defaultOpen = false,
  allowCollapse = false,
  expandButtonBottom = 10,
  children,
}: ExpandableContainerProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [overflowing, setOverflowing] = React.useState(false)
  const innerRef = React.useRef<HTMLDivElement | null>(null)

  const measure = React.useCallback(() => {
    const el = innerRef.current
    if (!el) return
    setOverflowing(el.scrollHeight > el.clientHeight + 1)
  }, [])

  React.useEffect(() => {
    if (!open) measure()
  }, [open, measure, children])

  React.useEffect(() => {
    const el = innerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      if (!open) measure()
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [open, measure])

  const showFloatingExpand = !open && overflowing
  const showCollapseButton = open && overflowing && allowCollapse

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="relative">
        <div
          ref={innerRef}
          style={!open ? { maxHeight: collapsedMaxHeight } : undefined}
          className="overflow-hidden text-sm text-foreground"
        >
          {children}
        </div>

        {/* 折叠态：底部渐隐遮罩 */}
        {!open && overflowing && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background to-transparent" />
        )}

        {/* 折叠态：浮动“展开全部”按钮（覆盖在内容区域底部居中） */}
        {showFloatingExpand && (
          <div
            className="absolute inset-x-0 flex justify-center"
            style={{ bottom: expandButtonBottom }}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="secondary"
                className="h-9 rounded-full px-4 text-xs font-medium shadow-sm"
              >
                <span className="mr-1.5">展开全部</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
        )}
      </div>

      {/* 展开态：可选“收起”按钮（放在内容下面，样式区分，不再浮动） */}
      {showCollapseButton && (
        <div className="mt-3 flex justify-center">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="h-9 rounded-full px-3 text-xs">
              <ChevronUp className="mr-1.5 h-4 w-4" />
              收起
            </Button>
          </CollapsibleTrigger>
        </div>
      )}
    </Collapsible>
  )
}