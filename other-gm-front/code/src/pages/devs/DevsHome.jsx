import { DevsListRenderer } from '../../components/DevsListRenderer';
import { DevsProvider } from '../../state/context';
import { Navigate } from 'react-router-dom';
export const DevsHome = () => {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/" replace></Navigate>
  }
  return (
    <DevsProvider>
      <DevsListRenderer />
    </DevsProvider>
  )
}
