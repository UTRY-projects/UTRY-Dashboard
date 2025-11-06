import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Link} from "react-router-dom";

const UIExplanation = () => {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">UTRY - Virtual Fitting Room</h1>
                <p className="text-muted-foreground mt-1">
                    This is an explanation of the UTRY - Virtual Fitting Room apps User Interface
                </p>
            </div>


            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle>UTRY - Button Explained</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-border">
                            <div className="text-lg text-muted-foreground mb-2">
                                The Admin View
                                <p className="text-sm">
                                    After installing the app, you’ll see our button appear in your admin panel:
                                </p>
                                <img className="pb-4" src="UI_explanation_img/AdminButtonExample.png"
                                     alt="View of the UTRY button in the admin view"/>
                                <p className="text-sm">In this example, the button is shown on a product page where the
                                    product <strong>does not yet have an EAN metafield added.</strong>
                                </p>
                                <p className="text-sm pb-4">
                                    You can find instructions on how to set this up in the
                                    <Link to="/integration"
                                          className=" text-sm text-sky-700 underline hover:text-black"> Manual
                                        Installation </Link> section.
                                </p>
                                <p className="text-sm pb-4">
                                    If the EAN metafield isn’t filled in, the app will automatically show a default
                                    avatar image instead.
                                </p>
                                <p className="text-sm">
                                    Once you’ve added EAN metafields to your products, you can confirm they’re set up
                                    correctly in the product’s admin view — it will look like this:
                                </p>
                                <img className="pb-4" src="UI_explanation_img/AdminButtonEanFilledExample.png"
                                     alt="View of the UTRY button in the admin view"/>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg border border-border">
                            <div className="text-lg text-muted-foreground mb-2">
                                The Storefront View
                                <p className="text-sm pb-4">
                                    On your store’s product page, the button will appear like this:
                                </p>
                                <img className="pb-4" src="UI_explanation_img/ButtonExample.png"
                                     alt="View of the UTRY button in the storefront view"/>
                                <p className="text-sm">
                                    When a visitor clicks the button, it opens our app’s interface, which displays as an
                                    overlay on top of the product page.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle>Virtual Fitting Room - UI</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-border">
                            <div className="text-lg text-muted-foreground mb-2">
                                Show/Hide.
                                <p className="text-sm pb-4">
                                    At the top of the overlay, you’ll find a button that lets you show or hide the main
                                    controls of the app.
                                </p>
                                <div className="flex items-start gap-1 pb-4">
                                    <img className="w-1/2" src="UI_explanation_img/hideElement.png"
                                         alt="View of the hide element in the app"/>
                                    <img className="w-1/2" src="UI_explanation_img/showElement.png"
                                         alt="View of the show element in the app"/>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg border border-border">
                            <div className="text-lg text-muted-foreground mb-2">
                                The main toolbar
                                <p className="text-sm pb-4">
                                    When the main toolbar is visible, you’ll see two options — one on the left and one
                                    on the right:
                                </p>
                                <img className="pb-4" src="UI_explanation_img/dropdowns.png"
                                     alt="View of the UTRY button in the storefront view"/>
                                <div className="flex items-start gap-6 pb-4">
                                    <p className="text-sm">
                                        <strong>Left side:</strong> Choose a clothing size. The avatar will automatically update to show the selected size.
                                    </p>
                                    <p className="text-sm">
                                        <strong>Right side:</strong> Choose a body type. The avatar will update to match the selected body type.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default UIExplanation;