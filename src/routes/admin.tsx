import { createFileRoute } from '@tanstack/react-router'
import { GetFoods } from '../components/GetFoods';

export const Route = createFileRoute('/admin')({
    component: RouteComponent,
})

function RouteComponent() {
    return <GetFoods />;
}
