How to to run app:  

1. Pull the project.  
2. Open console in project folder.  
3. Check "node -v" must be 16.16.0.  
4. Run "npm i" command.  
5. Run "npm start" command.  
6. Open web browser at page "localhost:8080" and enjoy the app!  

.env file is required.  
PORT  
MONGO_DB_CONN  
JWT_KEY  
SENDGRID_API_KEY  

Main Features:  
UBER like service for freight trucks, in REST style, using MongoDB as database. This service should help regular people to deliver their stuff and help drivers to find loads and earn some money. Application contains 2 roles, driver and shipper.  


Driver is able to:  
•	register in the system;  
•	login into the system;  
•	view his profile info;  
•	change his account password;  
•	add trucks;  
•	view created trucks;  
•	assign truck to himself;  
•	update not assigned to him trucks info;  
•	delete not assigned to him trucks;  
•	view assigned to him load;  
•	interact with assigned to him load.  

Shipper is able to:  
•	register in the system;  
•	login into the system;  
•	view his profile info;  
•	change his account password;  
•	delete his account;  
•	create loads in the system;  
•	view created loads;  
•	update loads with status ‘NEW';  
•	delete loads with status 'NEW';  
•	post a load;  
•	view shipping info.  

Feedback is welcome. A lot of stuff needs to be improved.

To do list:  
•	User is able to attach photo to his profile;  
•	Any system user can see weather information which should be stored on server side with axios;  
•	User can generate reports about shipped loads, in excel or pdf formats and download them;  
•	Ability to filter loads by status;  
•	Pagination for loads;  
•	Driver assigned to his load coordinates on the map on UI;  
• Driver is able to see info about assigned to him load(pick-up address, delivery address) on the map on UI;  
•	Driver and Shipper can contact each other through simple chat related to load;  
•	Driver and Shipper can receive real time shipments updates through WS with ;  
•	The most important functionality covered with unit and acceptance tests;  
•	Ability for any system user to choose language on UI(localization);  
•	Ability for any system user to choose color theme on UI;  
•	Application can handle time zones difference and notify driver if needed with Moment library;  
•	Any system user can get notifications through the email about shipment updates;  
•	Application should validate all endpoints parameters with Joi npm package;  
