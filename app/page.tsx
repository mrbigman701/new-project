// Root page - Simple static page that doesn't import any hooks
export default function RootPage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1>Alliance of Progressives in Ethiopia</h1>
      <p>Loading main site...</p>
      <script dangerouslySetInnerHTML={{
        __html: `window.location.href = '/';`
      }} />
    </div>
  )
}
