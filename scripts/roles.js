const faunadb = require("faunadb");
const { query: q } = faunadb;

//Roles Setup

//Commonly used predicate functions for roles to check for ownership of data

const readDeleteidentityCheck = q.Query(
  q.Lambda(
    "ref",
    q.Equals(
      q.Select(["data", "owner"], q.Get(q.Var("ref"))),
      q.CurrentIdentity()
    )
  )
);

const createIdentityCheck = q.Query(
  q.Lambda(
    "values",
    q.Equals(q.Select(["data", "owner"], q.Var("values")), q.CurrentIdentity())
  )
);

const updateIdentityCheck = q.Query(
  q.Lambda(
    ["oldData", "newData"],
    q.And(
      q.Equals(
        q.CurrentIdentity(),
        q.Select(["data", "owner"], q.Var("oldData"))
      ),
      q.Equals(
        q.Select(["data", "owner"], q.Var("oldData")),
        q.Select(["data", "owner"], q.Var("newData"))
      )
    )
  )
);

//Predicate functions specific to the application collection

const inputValidation = q.And(
  q.IsDate(q.Var("newdate")),
  q.ContainsValue(q.Var("newstatus"), [
    "Applied",
    "Interviewing",
    "Offer",
    "Rejected",
    "",
  ]),
  q.Not(q.Equals(q.Var("newcompany"), "")),
  q.Not(q.Equals(q.Var("newposition"), ""))
);

const applicatonUpdateIdentityCheck = q.Query(
  q.Lambda(
    ["oldData", "newData"],
    q.Let(
      {
        oldOwner: q.Select(["data", "owner"], q.Var("oldData")),
        newOwner: q.Select(["data", "owner"], q.Var("newData")),
        newdate: q.Select(["data", "date"], q.Var("newData")),
        newstatus: q.Select(["data", "status"], q.Var("newData")),
        newcompany: q.Select(["data", "company"], q.Var("newData")),
        newposition: q.Select(["data", "position"], q.Var("newData")),
      },
      q.And(
        q.Equals(q.CurrentIdentity(), q.Var("oldOwner")),
        q.Equals(q.Var("oldOwner"), q.Var("newOwner")),
        inputValidation
      )
    )
  )
);

const applicationCreateIdentityCheck = q.Query(
  q.Lambda(
    "values",
    q.Let(
      {
        owner: q.Select(["data", "owner"], q.Var("values")),
        newdate: q.Select(["data", "date"], q.Var("values")),
        newstatus: q.Select(["data", "status"], q.Var("values")),
        newcompany: q.Select(["data", "company"], q.Var("values")),
        newposition: q.Select(["data", "position"], q.Var("values")),
      },
      q.And(q.Equals(q.Var("owner"), q.CurrentIdentity()), inputValidation)
    )
  )
);

//Predicate functions specific to the accounts collection
const accountsUpdateIdentityCheck = q.Query(
  q.Lambda(
    ["oldData", "newData", "ref"],
    q.Equals(q.CurrentIdentity(), q.Var("ref"))
  )
);

const createAuthUserRole = q.CreateRole({
  name: "auth_user",
  privileges: [
    {
      resource: q.Function("addjobapplication"),
      actions: { call: true },
    },
    {
      resource: q.Function("updatejobapplication"),
      actions: { call: true },
    },
    {
      resource: q.Function("deletejobapplication"),
      actions: { call: true },
    },
    {
      resource: q.Function("getapplicationsbyowner"),
      actions: { call: true },
    },
    {
      resource: q.Function("getallapplications"),
      actions: { call: true },
    },
    {
      resource: q.Function("logout"),
      actions: { call: true },
    },
    {
      resource: q.Function("updatepassword"),
      actions: { call: true },
    },
    {
      resource: q.Collection("applications"),
      actions: {
        create: applicationCreateIdentityCheck,
        delete: readDeleteidentityCheck,
        read: readDeleteidentityCheck,
        write: applicatonUpdateIdentityCheck,
      },
    },
    {
      resource: q.Collection("accounts"),
      actions: {
        read: true,
        write: accountsUpdateIdentityCheck,
      },
    },
    {
      resource: q.Index("applications_by_owner"),
      actions: { read: true },
    },
    {
      resource: q.Index("all_applications"),
      actions: { read: true },
    },
  ],
  membership: [
    {
      resource: q.Collection("accounts"),
    },
  ],
});

const createClientRole = q.CreateRole({
  name: "client",
  privileges: [
    {
      resource: q.Function("userlogin"),
      actions: { call: true },
    },
    {
      resource: q.Function("usersignup"),
      actions: { call: true },
    },
    {
      resource: q.Collection("accounts"),
      actions: {
        read: true,
        create: true,
      },
    },
    {
      resource: q.Index("all_accounts"),
      actions: { read: true },
    },
    {
      resource: q.Index("accounts_by_email"),
      actions: { read: true },
    },
  ],
});
