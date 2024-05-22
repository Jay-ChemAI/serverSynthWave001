const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

// Define projectRoot aquí para que sea accesible en ambas rutas
const projectRoot = path.join(__dirname,'..', 'synthwave001');

app.get('/run-command', (req, res) => {
  const command = req.query.command;
  let cwd = req.query.cwd; // Declarar cwd aquí

  if (!command) {
    return res.status(400).send('No command provided');
  }

  if (!cwd) {
    return res.status(400).send('No working directory provided');
  }

  // Concatena el directorio raíz del proyecto con el cwd de la consulta
  cwd = path.join(projectRoot, cwd);

  console.log(`Running in directory: ${cwd}`); // Imprime el directorio de trabajo

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const child = exec(command, { cwd });

  child.stdout.on('data', (data) => {
    res.write(`data: ${data}\n\n`);
  });

  child.on('exit', () => {
    res.write('event: bot-finished\ndata: \n\n');
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.get('/getProjectRoot', (req, res) => {
  res.json({ cwd: projectRoot });
});