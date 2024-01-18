import Layout from './components/Layout'
import Book from './pages/Book'
import { createBrowserRouter } from 'react-router-dom'
import Chapter from './pages/Chapter'
// import Lessons from './pages/Lessons'

const Router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // { path: '/', element: <Lessons /> },
      {
        path: ':bookName/',
        element: <Book />,
      },
      {
        path: ':bookName/:chapter',
        element: <Chapter />,
      },
    ],
  },
])

export default Router
