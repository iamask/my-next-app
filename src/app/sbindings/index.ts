import { getCloudflareContext } from "@opennextjs/cloudflare";
 
export async function GET(request) {

	const { env, cf, ctx } = await getCloudflareContext();

 
	const myKv = (await getCloudflareContext()).env.sv.fetch(request);
	console.log(myKv)
 
	return new Response(JSON.stringify(myKv));
}