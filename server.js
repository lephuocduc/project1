const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    try {
        // Read the terraform state file
        const terraformState = JSON.parse(fs.readFileSync('C:/project/terraform.tfstate', 'utf8'));

        // Extract the data you need from the state file
        const resources = terraformState.resources.map(resource => ({
            mode: resource.mode,
            type: resource.type,
            terraformName: resource.name,
            vCenterName: resource.instances[0].attributes.name,
        }));

        // Extract resourcePools, datastores, and networks
        const resourcePools = resources.filter(resource => resource.type === 'vsphere_resource_pool').map(resource => resource.vCenterName);
        const datastores = resources.filter(resource => resource.type === 'vsphere_datastore').map(resource => resource.vCenterName);
        const networks = resources.filter(resource => resource.type === 'vsphere_network').map(resource => resource.vCenterName);

        // Read the guest_os.txt file and parse it into an array
        const guestOSOptions = fs.readFileSync('C:/project/guest_os.txt', 'utf8').split('\n');

        // Render the index page and pass the data
        res.render('index', { resources, resourcePools, datastores, networks, guestOSOptions });

    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while reading the terraform.tfstate file or the guest_os.txt file.');
    }
});

app.listen(3000, () => console.log('Server is running on port 3000'));
