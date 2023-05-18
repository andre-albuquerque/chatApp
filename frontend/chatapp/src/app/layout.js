import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider, RoomProvider, SocketProvider } from './context/page'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Chat App',
  description: 'Real time conversation.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <RoomProvider>
            <SocketProvider>
            {children}
            </SocketProvider>
          </RoomProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
