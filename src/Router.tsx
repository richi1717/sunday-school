import Layout from './components/Layout'
import AddLesson from './pages/AddLesson'
import EditLesson from './pages/EditLesson'
import { createBrowserRouter } from 'react-router-dom'
import Chapter from './pages/Chapter'
import Welcome from './pages/Welcome'
import ProtectedRoute from './ProtectedRoute'

const Router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Welcome /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'add-lesson/',
            element: <AddLesson />,
          },
          {
            path: 'edit-lesson/',
            element: <EditLesson />,
            children: [
              {
                path: ':bookName/:chapter',
                element: <EditLesson />,
              },
            ],
          },
        ],
      },
      {
        path: ':bookName/:chapter',
        element: <Chapter />,
      },
    ],
  },
])

export default Router
