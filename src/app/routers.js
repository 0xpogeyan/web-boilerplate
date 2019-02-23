import React, { lazy, Suspense } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Loading from '@/components/loading';

const Home = lazy(() => import('@/pages/home'));

function routers() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading isLoading />}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route component={() => <div>404 Not found</div>} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default routers;
