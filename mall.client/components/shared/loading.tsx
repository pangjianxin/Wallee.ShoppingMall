import { Spinner } from "@/components/ui/spinner";

export default function LoadingState({ title }: { title?: string }) {
  return (
    <div className="flex w-full h-64 justify-center items-center">
      <Spinner className="w-6 h-6 text-primary" />
      {title && <span>{title}</span>}
    </div>
  );
}
