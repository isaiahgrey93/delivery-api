# Joey API

## Configuration

The server is configured via the following environment variables, which should be placed in a `.env` file in the project root.

 - `JWT_SECRET`
 - `STRIPE_SECRET`

## RethinkDB Setup

1. Install RethinkDB ([http://rethinkdb.com/docs/install](http://rethinkdb.com/docs/install)).
2. Run `rethinkdb` command.
3. Navigate to [http:localhost:8080](http:localhost:8080) for admin panel.

## NPM Scripts

- `start` - start the server

## API Endpoints

### User
  - `GET` -- `/api/users`
  - `GET` -- `/api/users/{user_id}`
  - `POST` -- `/api/users`
  - `PUT` -- `/api/users/{user_id}`
  - `DELETE` -- `/api/users/{user_id}`
  - `POST` -- `/api/users/login`

### Vehicle
    
  - `GET` -- `/api/vehicles`
  - `GET` -- `/api/vehicles/{vehicle_id}`
  - `POST` -- `/api/vehicles`
  - `PUT` -- `/api/vehicles/{vehicle_id}`
  - `DELETE` -- `/api/vehicles/{vehicle_id}`

### Preset

  - `GET` -- `/api/presets`
  - `GET` -- `/api/presets/{preset_id}`
  - `POST` -- `/api/presets`
  - `PUT` -- `/api/presets/{preset_id}`
  - `DELETE` -- `/api/presets/{preset_id}`

### Drive
  - `GET` -- `/api/drives`
  - `GET` -- `/api/drives/{drive_id}`
  - `POST` -- `/api/drives`
  - `PUT` -- `/api/drives/{drive_id}`
  - `DELETE` -- `/api/drives/{drive_id}`
  - `POST` -- `/api/drives/{drive_id}/charge`
  - `POST` -- `/api/drives/{drive_id}/process`
  - `POST` -- `/api/drives/{drive_id}/refund`

### Support Calls
  - `GET` -- `/api/recordings`
  - `GET` -- `/api/recordings/{recording_id}`
  - `POST` -- `/api/recordings`
  - `PUT` -- `/api/recordings/{recording_id}`
  - `DELETE` -- `/api/recordings/{recording_id}`

### Stripe Accounts
  - `GET` -- `/api/accounts`
  - `GET` -- `/api/accounts/{user_id}`
  - `POST` -- `/api/accounts/{user_id}`
  - `PUT` -- `/api/accounts/{user_id}`
  - `DELETE` -- `/api/accounts/{user_id}`
