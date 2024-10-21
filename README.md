# Astra Apparel AI Shopping Assistant

A simple front-end for an AI shopping assistant for the "Astra Apparel" store. Created for Amazon Re:Invent 2024, using a "local" version of Lanflow running in AWS ECS.

## Environment file

You will need to build a `.env` file in the project's root directory for it to know how to connect to Astra DB.  There is an `.env_sample` file included to help you with this.  Just rename that file to be your new `.env`, edit your values, and you're all set:

```
mv .env_sample .env
```

Edit this file, and define the following variable.  This value can be retrieved from your (local) Langflow instance by clicking on the "</> API" button.

```
LANGFLOW_URL=<your-astra-db-id>
```

## React.js dependencies

Be sure to install the following npm packages:

```
npm @chatscope/chat-ui-kit-react
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload as you make changes.
