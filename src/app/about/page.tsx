interface ApiResponse {
    generation: {
      name: string;
    };
    move_learn_methods: {
      name: string;
    }[];
    versions: {
      name: string;
    }[];
    regions: {
      name: string;
    }[];
    pokedexes: {
      name: string;
    }[];
  }
  
  export default async function AboutPage() {
      // Fetch data from an external API
      const response = await fetch('https://pokeapi.co/api/v2/version-group/5/', { cache: 'no-store' }); // no-store ensures fresh data
      const data: ApiResponse = await response.json();
      
      // Log names to the console
      console.log("Generation:", data.generation.name);
      console.log("Move Learn Methods:");
      data.move_learn_methods.forEach(method => console.log(method.name));
      console.log("Versions:");
      data.versions.forEach(version => console.log(version.name));
      console.log("Regions:");
      data.regions.forEach(region => console.log(region.name));
      console.log("Pokedexes:");
      data.pokedexes.forEach(pokedex => console.log(pokedex.name));
      
      return (
        <main>
          <h1>About Us</h1>
          <p>Generation: {data.generation.name}</p>
          <p>Move Learn Methods: {data.move_learn_methods.map(method => method.name).join(', ')}</p>
          <p>Versions: {data.versions.map(version => version.name).join(', ')}</p>
          <p>Regions: {data.regions.map(region => region.name).join(', ')}</p>
          <p>Pokedexes: {data.pokedexes.map(pokedex => pokedex.name).join(', ')}</p>
        </main>
      );
  }
  