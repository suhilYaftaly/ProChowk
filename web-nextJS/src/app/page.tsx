// import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import User from "../components/User";

export default async function Home() {
  // const session = await getServerSession(authOptions);
  return (
    <section>
      <div>Hellow</div>
      {/* <p>{JSON.stringify(session)}</p> */}
      <User />
    </section>
  );
}
