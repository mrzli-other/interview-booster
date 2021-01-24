## Running Locally

### Setup Database

#### Using Docker

- setup:
  - install docker engine on your machine
  - navigate to `<project_root>/docker`
  - execute `bash dev-run.sh`
  - to run db migrations (create the table) and seed database, in `backend` folder run `yarn prisma migrate dev --preview-feature`
    - if you get an error about not being able to reach the database, wait a bit to allow docker container to initialize
    - if prompted for migration name, put anything you want, for example `init`
  - to seed the db, in `backend` run `yarn prisma db seed --preview-feature` (this will take a while, almost 4 mins on my machine)


- other:
  - to stop the database execute `bash dev-stop` in `docker` folder
  - to delete the database you can simply delete `data/db-data` (it would be better if docker instance is stopped while doing this)
  - see `backend/.env` for db parameters if you want to connect to the database with some other tool

#### Manually

- I will not describe this step-by-step, see `backend/.env` for db parameters (which you can also edit if you want to)

### Run App

- backend: in `backend`, run `yarn start`
- frontend: in `frontend`, run `yarn start`
- in browser, go to `http://localhost:3000`

## Design Decisions

I used project generators for setting up both backend and frontend, to somewhat reduce development time. Since this is an interview task, I did not clean up the
code completely as I would for production, but it should not be that bad. In an actual project I would probably not make api calls directly from component,
instead I would use some redux middleware (in case I ended up using Redux for state management), but for a very small project this saves time. There is possibly
some duplication in backend/frontend types, but resolving this properly seems to be a bit tricky and outside of the scope of this task in my opinion.

If I wanted to spend more time on the project, I would also add `prettier` to the frontend (it seems the backend already has it because generator put it there).
I would tweak lint rules a bit, but not too much, because customizing it too much can waste time now, and possibly in the future with rule updates. I also think
that staying close to the recommended rules means that new people on the project would have an easier time adjusting to work, but I'm not sure.

Also, I hardcoded some things that should not be hardcoded, for example backend url. This is just the easy thing to do here, not something I would do on a real
project.

I implemented some basic validation and input constraints on the frontend to somewhat improve UX compared to doing nothing (such as notifying the user of
missing input in required fields, or disabling of buttons if all the required values are not filled in).

I used Prism for database migrations (never used it before so I tried it out here), to simplify db setup and to make use of generated client code for db
interfacing.

In summary, I did the React and database parts of the optional tasks, for the rest I will just give some notes on how I would do them, or how I would start
thinking about solving them.

I usually do the authentication by creating a `User` table (and if necessary also `Role` and `Permission` tables). Also a table for access tokens. On login, a
token is entered into the token table, with expiry date, and returned to the client to be stored in a cookie. I would then
use [Guards](https://docs.nestjs.com/guards) on protected routes which would compare the cookie data to the db entries. A login screen would also be required
for this, and a frontend redirect to login screen in case of no auth token present, or in a case of 401 response status on any api call.

Regarding tests. On some occasions in the past I tried doing (I guess e2e, or maybe integration) tests on the backend, which made api calls, used actual
database etc. Not super fast, but was useful in my situations, on one project I used it for testing most scenarios on almost all endpoints, it made the backend
very robust. This requires some setup, I would have to automatically start up the database, maybe it would make sense to use some simple in-memory database, or
it might be better and more production-like to use postgres for testing as well as development/production. This would require running a docker container for
test (or something else I cannot now think of now, maybe there is a better way). This is also something that would need to be setup for CI, it would take time
for someone like me (who is not a DevOps expert) to implement.

If there is some complicated logic, utility code, or a part of the system with many code paths on either the backend or frontend, unit tests would be
appropriate for that.

While I technically know how to use react testing library for testing UI, I don't have a clear idea know what should be tested here. Maybe I am not used to it,
but writing tests for UI seems to be very time consuming. In terms of e2e, on a previous project I wrote a handful of Cypress tests, so I know in principle how
they can be used for e2e testing. Maybe they are appropriate to be used on some complicated and error prone flows, or some often used features, or parts of the
app that caused most problems in the past (like places with frequent regressions). Anyway, for start, those (Cypress) tests could be run manually, and later on
there might a way to integrate them into CI flow (but without digging deeper I would not know how exactly).

Logging is a simpler problem than tests. It would probably make sense to log backend exceptions, and maybe have a logging middleware/interceptor for all
requests, which could be turned on as necessary (by changing the logging level). On my last project we also used [Sentry](https://sentry.io/) to log frontend
errors, this was useful in for resolving some issues.

Some basic CI is usually not that difficult to do, but there are some challenges in this case. This repository is a kind of a monorepo, with `frontend`
and `backend` projects in the same repository. This would complicate auto-deploy on (for example) heroku (using github commit hooks), but possibly not much. In
the case of heroku, from what I know, each app part would have to be deployed to a separate 'dyno'. On an additional note, it would probably be possible to
trigger a deploy of a frontend/backend part only if a commit affected respective folders, to avoid unnecessary depoloys. I don't know how I would automatically
deploy and migrate the db, so when initially doing CI, I would probably do the database setup manually. Prism could be of some help here, but I am not sure.
Running simple tests and linters should be easy using either github actions or heroku. Tests that require external setup, such as the database situation
mentioned above, would probably be more challenging. One more thing that I know is possible when deploying to heroku or some other equivalent platform (and I
have done it before), is having a 'Deploy' button in a README like this, at least for non-monorepo projects. It allows (almost) a one-click heroku app-setup,
with just a few manual steps after that.

Hosting the code online is the simplest optional task here, and it would be useful even on an interview task. However, it would still require more time to do
than I have to spend on the task. So only localhost is available.
