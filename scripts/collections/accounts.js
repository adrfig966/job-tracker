const faunadb = require("faunadb");
const { query: q } = faunadb;

//Account Collection Setup

const createAccountsCollection = q.CreateCollection({ name: "accounts" });

const createIndexAllAccounts = q.CreateIndex({
  name: "all_accounts",
  source: q.Collection("accounts"),
  values: [{ field: ["ref"] }],
  serialized: true,
});

const createIndexAccountsByEmail = q.CreateIndex({
  name: "accounts_by_email",
  source: q.Collection("accounts"),
  terms: [{ field: ["email"] }],
  values: [{ field: ["ref"] }],
  serialized: true,
  unique: true,
});

const createUserSignUpFunction = q.CreateFunction({
  name: "usersignup",
  role: null,
  body: q.Query(
    q.Lambda(
      ["email", "password", "confirmpassword"],
      q.If(
        q.Equals(q.Var("password"), q.Var("confirmpassword")),
        q.Create(q.Collection("accounts"), {
          credentials: {
            password: q.Var("password"),
          },
          data: {
            email: q.Var("email"),
          },
        }),
        q.Abort("Passwords do not match")
      )
    )
  ),
});

const createUpdatePasswordFunction = q.CreateFunction({
  name: "updatepassword",
  role: null,
  body: q.Query(
    q.Lambda(
      ["ref", "password"],
      q.Update(q.Ref(q.Collection("accounts"), q.Var("ref")), {
        credentials: { password: q.Var("password") },
      })
    )
  ),
});

const createUserLoginFunction = q.CreateFunction({
  name: "userlogin",
  role: null,
  body: q.Query(
    q.Lambda(
      ["email", "password"],
      q.Login(q.Match(q.Index("accounts_by_email"), q.Var("email")), {
        password: q.Var("password"),
      })
    )
  ),
});

const createUserLogoutFunction = q.CreateFunction({
  name: "logout",
  role: null,
  body: q.Query(q.Lambda([], q.Logout(true))),
});

module.exports = {
  createAccountsCollection,
  createIndexAllAccounts,
  createIndexAccountsByEmail,
  createUserSignUpFunction,
  createUserLoginFunction,
  createUserLogoutFunction,
  createUpdatePasswordFunction,
};
