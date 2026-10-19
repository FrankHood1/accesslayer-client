import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import CreatorDetailPage from './pages/CreatorDetailPage';
import CreatorDashboardPage from './pages/CreatorDashboardPage';

export const routes = [
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/creators',
		element: <HomePage />,
	},
	{
		path: '/creator/:id',
		element: <CreatorDetailPage />,
	},
	{
		path: '/creators/:id',
		element: <CreatorDetailPage />,
	},
	{
		path: '/creator/:id/dashboard',
		element: <CreatorDashboardPage />,
	},
	{
		path: '/creators/:id/dashboard',
		element: <CreatorDashboardPage />,
	},
	{
		path: '/dashboard',
		element: <CreatorDashboardPage />,
	},
	{
		path: '*',
		element: <NotFoundPage />,
	},
];
