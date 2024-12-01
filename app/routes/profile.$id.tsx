import { Form, redirect, useLoaderData } from "@remix-run/react";
import { deleteUser, findUser, User } from "users";

// loader function is a server side function that is called before the component is rendered
// loader is used for loading data that is to be used in the component
export const loader = async ({ params }: { params: { id: string } }) => {
  //   console.log("Params", params); // this runs on the server

  const user = findUser(params.id);

  if (!user) {
    return redirect("/");
    // redirect is a function that exists in the server
  }

  return new Response(JSON.stringify(user), {
    headers: { "Content-Type": "application/json" },
  });
};

export const action = async ({
  params,
  request,
}: {
  params: { id: string };
  request: Request;
}) => {
  const formData = await request.formData();
  const actionType = formData.get("action") as string;

  if (actionType === "logout") {
    return redirect("/");
  }

  if (actionType === "delete") {
    deleteUser(params.id);
    return redirect("/");
  }
};

const Profile = () => {
  const user = useLoaderData<User>();

  //   console.log(user);

  const handleClientSideLogout = async (action: string) => {
    if (action === "logout" || action === "delete") {
      localStorage.removeItem("userLogged");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user.name}!
        </h1>
        <p className="text-gray-600 mt-2">Email: {user.email}</p>
        <div className="mt-6 flex space-x-4">
          <Form
            method="post"
            onSubmit={() => handleClientSideLogout("logout")}
          >
            <input
              type="hidden"
              name="action"
              value="logout"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Logout
            </button>
          </Form>

          <Form
            method="post"
            onSubmit={() => handleClientSideLogout("delete")}
          >
            <input
              type="hidden"
              name="action"
              value="delete"
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Delete Account
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
