export default function AuthExchangeError() {
    return (
      <div>
        <h1>Authentication Error</h1>
        <p>There was an error exchanging the authentication code for a session. Please try logging in again.</p>
        <a href="/login">Return to Login</a>
      </div>
    )
  }