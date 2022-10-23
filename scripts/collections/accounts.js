const faunadb = require('faunadb')
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
});

const createUserSignUpFunction = q.CreateFunction({
  name: "usersignup",
  role: null,
  body: q.Query(
    q.Lambda(
      ["email", "password"],
      q.Create(q.Collection("accounts"), {
        credentials: { password: q.Var("password") },
        data: { email: q.Var("email") }
      })
    )
  )
});

const createUserLoginFunction = q.CreateFunction({
  name: "userlogin",
  role: null,
  body: q.Query(
    q.Lambda(
      ["email", "password"],
      q.Login(q.Match(q.Index("account_by_email"), q.Var("email")), {
        password: q.Var("password")
      })
    )
  )
});

const createUserLogoutFunction = q.CreateFunction({
  name: "logout",
  role: null,
  body: q.Query(
    q.Lambda(
      [],
      q.Logout(true)
    )
  )
});

module.exports = {
  createAccountsCollection,
  createIndexAllAccounts,
  createIndexAccountsByEmail,
  createUserSignUpFunction,
  createUserLoginFunction,
  createUserLogoutFunction
};