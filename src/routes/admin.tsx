import { createFileRoute } from '@tanstack/react-router'
import { GetMeals } from '../components/GetMeals';

export const Route = createFileRoute('/admin')({
    component: RouteComponent,
})

function RouteComponent() {
    return <GetMeals />;
}
