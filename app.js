const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');
const useragent = require('express-useragent');
const path = require('path');
const axios = require('axios');

const app = express();
const puerto = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(useragent.express());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/enviar-correo/:horaCliente/:clienteZonaHoraria', async (req, res) => {
  const horaCliente = req.params.horaCliente;
  const userAgent = req.useragent.source;

  // Obtener la zona horaria del cliente
  const clienteZonaHoraria = req.params.clienteZonaHoraria;
  const offsetZonaHoraria = moment.tz(clienteZonaHoraria).format('Z');

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'kevinsss2412@gmail.com',
      pass: 'ukov soqz srwh ondu',
    },
  });

  const mailOptions = {
    from: 'kevinsss2412@gmail.com',
    to: 'kevin.cabrera@mail.udp.cl',
    subject: 'Nueva visita a tu página web',
    text: `Alguien ha ingresado a tu página web.\nHora del cliente: ${horaCliente}\nZona horaria del cliente: ${clienteZonaHoraria} (GMT${offsetZonaHoraria})\nUser-Agent: ${userAgent}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado');
    res.send('Correo enviado correctamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).send('Error al enviar el correo');
  }

});

function hacerSolicitud() {
  axios.get('http://localhost:3000')
    .then(response => {
      // Manejar la respuesta del servidor
      console.log(response.data);
    })
    .catch(error => {
      // Manejar el error de la solicitud
      console.error(error);
    });
}

// Realizar la primera solicitud inmediatamente
hacerSolicitud();

// Repetir la solicitud cada 1 minuto (60000 milisegundos)
setInterval(hacerSolicitud, 60000);

app.listen(puerto, () => {
  console.log(`Servidor iniciado en el puerto ${puerto}`);
});
