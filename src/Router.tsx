import Layout from './components/Layout'
import AddLesson from './pages/AddLesson'
import EditLesson from './pages/EditLesson'
import { createBrowserRouter } from 'react-router-dom'
import Chapter from './pages/Chapter'
import Welcome from './pages/Welcome'

const Router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Welcome /> },
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
      {
        path: ':bookName/:chapter',
        element: <Chapter />,
      },
    ],
  },
])

export default Router
