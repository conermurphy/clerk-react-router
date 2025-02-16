import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes'

export default [
  layout('./routes/layouts/layout.tsx', [
    index('routes/home.tsx'),
    route('new', 'routes/new.tsx'),
    route(':id', 'routes/:id.tsx'),
  ]),
  layout('./routes/layouts/auth-layout.tsx', []),
] satisfies RouteConfig
