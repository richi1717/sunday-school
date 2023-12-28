import Layout from './components/Layout'
import Book from './pages/Book'
import { createBrowserRouter } from 'react-router-dom'
import Chapter from './pages/Chapter'

const Router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'books/:bookName/',
        element: <Book />,
      },
      {
        path: 'books/:bookName/:chapter',
        element: <Chapter />,
      },
    ],
  },
])

export default Router
