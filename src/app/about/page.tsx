interface ApiResponse {
  message: string;
}

export default async function AboutPage() {
    // Fetch data from an external API
    const response = await fetch('https://pokeapi.co/api/v2/version-group/5/', { cache: 'no-store' }); // no-store ensures fresh data
    const data: ApiResponse = await response.json();
  
    return (
      <main>
        <h1>About Us</h1>
        <p>Message from API: {data.message}</p>
      </main>
    );
  }
  