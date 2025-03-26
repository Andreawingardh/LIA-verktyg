import { login, signup } from './actions'
import LoginForm from '../components/form/Form'

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
      <button formAction={login}>Log in</button>
      {/* <button formAction={signup}>Sign up</button> */}
    </div>
  )
}