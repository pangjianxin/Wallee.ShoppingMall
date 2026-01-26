import { WalleeMallCarouselsDtosCarouselDto } from "@/openapi";
import { FC, use } from "react";
import { Carousels } from "@/components/mobile/carousels";
type Props = {
  carouselsPromise: Promise<
    WalleeMallCarouselsDtosCarouselDto[] | null | undefined
  >;
};
const Fc: FC<Props> = ({ carouselsPromise }) => {
  const carousels = use(carouselsPromise);
  return <Carousels carousels={carousels || []}></Carousels>;
};
export default Fc;