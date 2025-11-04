import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button as ShadcnButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import { useMemo } from 'react';
import { Button } from '@shopify/polaris';

const YOUR_APP_API_KEY = '6feca39509df11b363bb0a7300580b2f'
const YOUR_THEME_BLOCK_HANDLE = 'customer_review';


const errorLogs = [
  {
    id: 1,
    timestamp: "2024-01-15 14:32:18",
    description: "Product sync timeout for SKU-12345",
    status: "resolved",
  },
  {
    id: 2,
    timestamp: "2024-01-15 12:10:05",
    description: "API rate limit exceeded",
    status: "resolved",
  },
];

const Integration = () => {
  const deepLinkUrl = useMemo(() => {
    const host = new URLSearchParams(window.location.search).get('host')
    const shop = new URLSearchParams(window.location.search).get('shop')
    console.log("click");
    if(!host){
      return '';
    }
    const shopDomain = atob(host);
    return `https://${shopDomain}/admin/themes/current/editor?template=product&addAppBlockId=
            ${YOUR_APP_API_KEY}/${YOUR_THEME_BLOCK_HANDLE}&target=mainSection`;
  }, []);
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integration Health</h1>
        <p className="text-muted-foreground mt-1">
          Monitor connection status and system health
        </p>
      </div>

      {/* Integration Status Card */}
      <Card className="shadow-card grid grid-cols-3 md:grid-cols-1 gap-6">

        <CardContent className="space-y-6">
          <CardHeader>
            <CardTitle>Integration</CardTitle>
            <p>With the inegration the app will be embeded into product pages. Click button below to start Integration</p>
            <div className="flex gap-4 mt">
              <Button url={deepLinkUrl} external> Integrate </Button>
              <Button> Contact Support </Button>
            </div>

          </CardHeader>
        </CardContent>


      </Card>

      <Card className="shadow-card grid grid-cols-3 md:grid-cols-1 gap-6">

        <CardContent className="space-y-6">
          <CardHeader>
            <CardTitle>Manual installation guide</CardTitle>
            <h2>Our app requires following permissions:</h2>
            <ul className="list-disc pl-4">
              <li>To read products: This is done to find your product in our database so we can render the clothing onto the 3D model.</li>
              <li>To read orders: This is done to log if users have actually used this app to purchase your items, so we can see if the app is being used, and how much it is being used.</li>
              <li>Before installing the app, you will need to talk with our representative, so that we can model your clothing items, so that your customers can see the correct clothing items on the 3D model. As well as discuss a payment plan.</li>
              <p><strong>This is critical, since our app will not be able to show the correct clothing if you have not done this.</strong></p>
            </ul>
          </CardHeader>
          <CardHeader>
            <CardTitle>Installation as an app:</CardTitle>
            <ul className="list-decimal pl-4">
              <li className="pl-4">Find the UTRY app on marketplace, this will forward you to our app page when you install it, where you will then need to accept the permissions mentioned above.</li>
              <li className="pl-4">Install the app block into your store in the admin view on a product page by:
                <ul className="pb-8">
                  <li>a.	Go into customize your store.</li>
                  <img src="UTRY_instalation_guide_img/Billede1.png" alt="View of shopify's store customization page" />
                  <li>b.	Go into one of your product pages.</li>
                  <li>c.	Adding the app block by clicking the blue + on a product page in the desired location of the button.</li>
                  <img src="UTRY_instalation_guide_img/Billede2.png" alt="Visualization of add button" />
                  <li>d.	Click app in the pop-up window.</li>
                  <img src="UTRY_instalation_guide_img/Billede3.png" alt="Press apps button" />
                  <li>e.	Scroll down to find the UTRY button app, or search for UTRY button app in the search field.</li>
                  <img src="UTRY_instalation_guide_img/Billede4.png" alt="Placement of UTRY app block" />
                  <li>f.	Click it to add it into the product page.</li>
                  <p><strong>NOTE:</strong> It has to be installed on a product page for it to function. And this will insert the button across all you product pages.
                    And if you have set up product pages differently you will need to embed the app on your other pages. So if it is not installed across all your products check which ones it isn’t added to and go into each of these and follow the procedure to add the app on these pages.
                  </p>
                </ul>
              </li>
              <li className="pl-4">After installing it click the UTRY button element once in admin view, and you will need to set some settings in the right sidebar:</li>
              <ul className="pb-8">
                <li>a.	First you need to insert the Client ID you have been provided by UTRY</li>
                <img src="UTRY_instalation_guide_img/Billede5.png" alt="Visualization of client ID typefield in admins schematic" />
                <p>Do note that to start with this is filled in, this is for a demo preview of our app.</p>
                <li>b.	Then you need to insert the Signing key also provided by UTRY in the UTRY signing key field</li>
                <img src="UTRY_instalation_guide_img/Billede6.png" alt="signing key typefield in admins schematic" />
                <p>Do note that to start with this is filled in, this is for a demo preview of our app.</p>
                <li>c.	Then in the app proxy path field insert /apps/utry/ if it is empty, otherwise leave it filled in.</li>
                <img src="UTRY_instalation_guide_img/Billede7.png" alt="app proxy path typefield in admins schematic" />
              </ul>
              <li className="pl-4">For our system to recognize each piece of clothing, you will need to create a metafield named ean:</li>
              <ul>
                <li>a.	On your shopify admin page, click settings, in the bottom left corner.</li>
                <img src="UTRY_instalation_guide_img/Billede8.png" alt="Settings" />
                <li>b.	Click on Metafields and metaobjects in the left sidebar.</li>
                <img src="UTRY_instalation_guide_img/Billede9.png" alt="meta fields and meta objects placement in settings" />
                <li>c.	In the list that appears press Products.</li>
                <img src="UTRY_instalation_guide_img/Billede10.png" alt="products in meta fields and meta objects" />
                <li>d.	In this new window press add definition in the top left.</li>
                <img src="UTRY_instalation_guide_img/Billede11.png" alt="What button to press to add meta field definition" />
                <li>e.	Fill in the following fields:
                  <ul className="list-decimal pl-10">
                    <li>Name: EAN</li>
                    <li>Description: A unique identifier for your products generated by UTRY</li>
                    <li>Press the blue select type and select Single line text</li>
                    <li>Press save</li>
                  </ul>
                  <img src="UTRY_instalation_guide_img/Billede12.png" alt="fill out form for EAN fields" />
                </li>

                <li>f.	Now go into your home on <a href="https://admin.shopify.com/">admin.shopify.com</a> </li>
                <li>g.	Press products</li>
                <img src="UTRY_instalation_guide_img/Billede13.png" alt="main menu products section" />
                <li>h.	For each product:</li>
                  <ul className="list-decimal pl-10">
                    <li>Click into a product</li>
                    <li>Scroll all the way down</li>
                    <li>Here you will find the new EAN field, and on each product you should fill in the corresponding EAN provided to you for each product, and press save whenever you are done with one.</li>
                    <img src="UTRY_instalation_guide_img/Billede14.png" alt="product specific EAN type field" />
                    <p>if you do not fill this in correctly it will default to an ean that will lead to the default clothing item.</p>
                  </ul>
              </ul>
            </ul>
          </CardHeader>
           <CardHeader>
            <CardTitle>Uninstalation guide</CardTitle>
            <ul className="list-decimal pl-4">
              <li className="pl-4">Log into shopify admin panel</li>
              <li className="pl-4">Navigate to settings in the bottom-left corner</li>
              <li className="pl-4">Navigate to Apps and sales channel</li>
              <li className="pl-4">Find UTRY app from the list</li>
              <li className="pl-4">Click the three dots next to the apps name</li>
              <li className="pl-4">Click the uninstall from the options that appear</li>
              <li className="pl-4">If prompted, select a reason for uninstalling the app from the dropdown menu</li>
              <li className="pl-4">Click uninstall to complete the process.</li>
            </ul>
          </CardHeader>
        </CardContent>
      

      </Card>






      {/* Error Logs
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Updates</CardTitle>
            <Badge variant="outline" className="text-muted-foreground">
              {errorLogs.length} events
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {errorLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errorLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className="bg-success/10 text-success hover:bg-success/20"
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No issues detected</p>
            </div>
          )}
        </CardContent>
      </Card>
         */}
    </div>
  );
};

export default Integration;

