import { createFileRoute } from "@tanstack/react-router";
import { GetFoods } from "../components/GetFoods";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GetFoods />;
}
