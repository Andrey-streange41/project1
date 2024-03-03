по бажанню, якщо цікаво подивитись функцію підтвердження аккаунту посиланням:
Для того, щоб наша функція відправки листів на електронну пошту через Gmail працювала належним чином, необхідно увімкнути доступ IMAP в налаштуваннях вашого облікового запису Gmail. Це можна зробити, перейшовши за наступним посиланням: https://mail.google.com/mail/u/0/#settings/fwdandpop.

Gmail -> Settings -> Forwarding and POP/IMAP

Прикріплю до листа з посиланням на цей проект приклад .dotenv файлу , треба буде додати деякі налаштування:
SMTP_USER=yourEmailAdress  <=
SMTP_PASSWORD=YourPassword <=

- npm test 
- npm install
- npm run start:dev
