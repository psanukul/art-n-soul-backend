import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PWD,
  },
});


// contact mail

export const sendContactMail = async (userData) => {

    console.log('in here --. ', process.env.MAIL_ID)

  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Customer Contact Request</title>
      <style>
          body {
              background-color: #ffffff;
              color: #000000;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              font-family: 'Oswald', sans-serif;
          }
      
          .container {
              width: 650px;
              border: 5px solid #000000;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
              border-radius: 15px;
          }
          .header {
              text-align: center;
              margin-bottom: 20px;
          }
          .title {
              font-size: 24px;
              font-weight: bold;
          }
          table {
              width: 100%;
              border-collapse: collapse;
          }
          td {
              padding: 10px;
              color: #000000;
          }
          .bd {
              border-bottom: 3px solid #ffffff;
          }
          .total {
              font-size: 24px;
              font-weight: bold;
          }
          .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #000000;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header"></div>
          <table>
              <tr>
                  <td><strong>Name:</strong></td>
                  <td>${userData?.name}</td>
              </tr>
              <tr>
                  <td><strong>E-Mail:</strong></td>
                  <td>${userData?.email}</td>
              </tr>
              <tr>
                  <td><strong>Mobile:</strong></td>
                  <td>${userData?.mobile}</td>
              </tr>
              <tr>
                  <td><strong>About Wedding:</strong></td>
                  <td>${userData?.aboutWedding}</td>
              </tr>
              ${userData?.guestCount ?
                `<tr>
                  <td><strong>Guest Count:</strong></td>
                  <td>${userData?.guestCount}</td>
              </tr>` : ''
              }
              <tr>
                  <td><strong>Event Location:</strong></td>
                  <td>${userData?.location}</td>
              </tr>
             <tr>
                  <td><strong>Event Date:</strong></td>
                  <td>${userData?.eventDate}</td>
              </tr>
              <tr>
                  <td><strong>Service Type:</strong></td>
                  <td>${userData?.serviceType}</td>
              </tr>
          </table>
      </div>
  </body>
  </html>`;

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.MAIL_ID, // sender address
    to: [process.env.MAIL_ID], // list of receivers
    subject: `Contacted by ${userData.name} `, // Subject line
    html: htmlContent, // html body
  });
};
