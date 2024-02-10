# AssetTrack

AssetTrack is an asset management system designed to catalogue, track, and manage parts within an organisation.  
The system aims to streamline inventory management processes, providing a centralised solution for users to monitor, control, and trace assets throughout their lifecycle.  
The core functionality of AssetTrack includes maintaining a holistic list of all components used by an organisation as well as  
viewing and accessing any derivative parts to each component.  
AssetTrack allows users to add, delete, search, and manage parts, as well as explore how each part fits into an assembly.   
The system facilitates user authentication, a system homepage for easy navigation as well as spares and operational inventories and their allocation to assemblies.  
  
Entry to the application is via a sign in page.  
Users cannot create their own accounts, the system is controlled by admins who will manually add users to the database and issue those users with their acess credentials.  
  
Provide the admin provided username and password on the user-page, then  
--> hit "Login".  
>[!NOTE]
> Whilst under development, an alert will provide sign in credentials.  
> These are provided below for the same purpose:  
> Username: Admin  
> Password: assetTrack1!  
  
You will then be re-directed to a home page, with  system description and navigation options to a Parts Catalogue, Inventory and Operational Inventory.  
Navigation options are provided in the nav-bar at the top of each page.  
  
### Parts Catalogue Page:  
The purpose of the parts catalogue is to provide control over data validation for the system.  
The intent is that parts are entered into the catalogue to define them in the database as reference for the rest of the system.  
>[!Warning]
>This is an unfinished feature still under development and has not yet been integrated with the rest of the system.  
>As such validation cannot currently be referenced to this page.  
  
### Inventory:  
The inventory is the collection of spare parts available in a spares store for use by the airline using the system.  
    
Logistics personell can enter the part into the system upon receipt of that part into the spare's store.  
To do so:  
--> Hit the "ADD PART" button.  
A pop up form will be provided where details can be provided in the fields as follows:  
* Part Name: Enter the name of the part - this field is compulsory.    
* Part Number: Enter the part number of the part - this field is compulsory.  
* Part Family: Select the correct part family of the part from the drop down menu provied - this field is compulsory.  
* Part Image Path: Provide the name of the picture saved in the provided system folder that you want displayed for this part - this field is optional.  
* Description: Enter a description of the part - This field is compulsory.  
--> Hit the "SUBMIT" button.  
If any of the compulsory fields have not been completed the submission will not go ahead, instead the user will be informed with a message beneath the required field that they need to provide an entry in          that field.
  
Logistics or maintenance personell can search the inventory for parts that are available to the airline.  
To do so:  
--> Hit the "SEARCH" button.
A pop up form will be provided where the search term can be entered.  
Multiple search filters can be applied together.  

### Operational Inventory:  
The operational inventory is used to track parts installed to aircraft.  

The landing page for the operational inventory shows the airline fleet.  
  
Additional aircaft can be added using the button at the bottom of the page.  
--> Hit the "Add Aircraft" button.
A pop up form will be proveded where you can enter the aircraft registration and again hit "Add Aircaft" on the pop up form.  

To view an aircraft, click the button displaying the registration of the desired aircraft.  
A table will be presented with all parts fitted to the aircraft and an additional button to "Install Parts".  
To install a part to the aircraft, it first has to be available in the (spares) inventory. Ensure the desired part is available on the inventory page before trying to add it to an aircraft.  
When satisfied that a part is available,  
--> Hit the "Install Parts" button.
A pop up form will be provided where the part name can be entered before once again hitting "Install Part" within the pop up form.

 
  
