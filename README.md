# Food Cart Pages / CartsPDX

Food Cart Pages is a [Sammy.js-On-CouchApp/soca](http://github.com/quirkey/soca) application that lets you view and edit Food cart and truck information in Portland, OR. Since it's a CouchApp, the only dependency to run Food Cart Pages is CouchDB!

# Installation/Getting it Running

Super easy. First, get yourself a Couch: 

[http://www.couchone.com/get](http://www.couchone.com/get)

Next, clone or fork action:

    git clone git://github.com/maxogden/foodcartpages.git
    
Then edit your DB URL in your .couchapprc
    
    cd foodcartpages
    open .couchapprc
    
You should make the `"default"` URL map to your couch including your username and password. By default, CouchDB is in admin party mode (meaning you dont need a user/pass and every one is an admin) so you can just get rid of the 'admin:admin' in the default URL or add an admin/admin user to your CouchDB instance.

Then, its easy-peasy:

    soca push
    soca open 
    
And it should open in your browser. If it doesn't, try running 

    soca push --debug 
    
And hopefully it will spit out some errors.





    