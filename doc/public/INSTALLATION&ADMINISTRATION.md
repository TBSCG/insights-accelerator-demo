## Packages and guides available in this repository

* Magnolia Insights Accelerator

## Instructions for Installing an Artifact from GitHub Packages into a Maven Project
To install an artifact from the magnolia-packages GitHub repository into your Maven project, follow these steps:

### 1. Setting up new user to access magnolia packages on github
* Set up new user account on github (or utilize your existing user account)
* Make sure your account has MFA enabled (otherwise you will not be granted access)
* Request access to TBSCG/magnolia-packages form the TBSCG sales representative
* Once access is granted please generate Personal Access Token (see below)

### 2. Set Up GitHub Authentication (Personal Access Token)
To authenticate to GitHub Packages, you'll need a Personal Access Token (PAT).
To obtain your PAT and access credentials, login to https://github.com with your account that had access to the repository granted.
Then on Github web console
* Click your user icon in top right corner
* Click "Settings"
* Scroll down & Click "Developer settings" in the left hand menu (bottom most option)
* Click "Personal Access Tokens" & then Tokens(classic)
* Click Generate New Token and then select Token (classic) from the dropdown
* Give name to your token
* Set expiration date to your desired value
* Check read:packages scope (this is the only permission you need)
* click "generate token" , *WARNING!* the token is shown ever only once, if you don't save it securely, you will have to regenerate it.

### 3. Configure Your settings.xml in Maven
To allow Maven to authenticate to GitHub Packages, you'll need to modify your settings.xml file (located in your Maven installation's conf directory or in your ~/.m2 directory).
Add the following configuration to the servers section of the settings.xml:
   ```xml
<servers>
   <server>
      <id>github</id>
      <username>your-github-username</username>
      <password>your-personal-access-token</password>
   </server>
</servers>
   ```
*	Replace your-github-username with your actual GitHub username.
*	Replace your-personal-access-token with the token you generated in the previous step.

### 4. Configure Your pom.xml to Use GitHub Packages
In your Maven project's pom.xml file, you'll need to add the GitHub Packages repository and specify the artifact you want to install.
Add the GitHub Packages Repository to Your pom.xml
Inside your <repositories> section, add the following configuration:

   ```xml
<repositories>
   <repository>
      <id>github</id>
      <url>https://maven.pkg.github.com/TBSCG/magnolia-packages</url>
   </repository>
</repositories>
   ```

This will tell Maven where to find the artifacts on GitHub Packages.
#### Add the Dependency to Your pom.xml
Now, you can add the specific artifact you want to install as a dependency in your <dependencies>section. For example:


   ```xml
<dependencies>
   <dependency>
      <groupId>org.tbscg</groupId>
      <artifactId>insights-accelerator</artifactId> 
      <version>6.3.0.2</version> 
   </dependency>
</dependencies>
   ```
**IMPORTANT! the above version number is an example, make sure you use most recent version for your magnolia!**

## Sample maven settings xml (Full configuration for magnolia dxp + insights)

You need to obtain credentials to access magnolia nexus repository. Request your team leader / project manager to
provide them.
Once you have username and password, configure the following in your maven settings.xml file.
The settings file is located at `~/.m2/settings.xml` on MacOS and Linux and `C:\Users\<username>\.m2\settings.xml` on
Windows.

In the xml below replace:

* #USER# with your magnolia nexus repository username
* #PASSWORD# with your magnolia nexus repository password

Replace ${XXXX} with actual values

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
    <!-- This is a settings.xml file retrieved from http://nexus.magnolia-cms.com/ -->
    <servers>
        <server>
            <id>magnolia.nexus.enterprise</id>
            <username>#USER#</username>
            <password>#PASSWORD#</password>
        </server>
        <server>
            <id>magnolia.addons.releases</id>
            <username>#USER#</username>
            <password>#PASSWORD#</password>
        </server>
    </servers>
    <profiles>
        <profile>
            <id>magnolia-repositories</id>
            <repositories>
                <repository>
                    <id>magnolia.nexus.enterprise</id>
                    <url>https://nexus.magnolia-cms.com/content/groups/enterprise/</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
                <repository>
                    <id>vaadin-addons</id>
                    <url>https://maven.vaadin.com/vaadin-addons/</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
                <repository>
                    <id>github</id>
                    <url>https://maven.pkg.github.com/TBSCG/magnolia-packages</url>
                </repository>
            </repositories>
            <pluginRepositories>
                <pluginRepository>
                    <id>magnolia.nexus.enterprise</id>
                    <url>https://nexus.magnolia-cms.com/content/groups/enterprise/</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </pluginRepository>
            </pluginRepositories>
        </profile>
    </profiles>
    <activeProfiles>
        <activeProfile>magnolia-repositories</activeProfile>
    </activeProfiles>
    <pluginGroups>
        <!-- define the sonatype plugin group, so the nexus plugins will work without typing the groupId -->
        <pluginGroup>org.sonatype.plugins</pluginGroup>
    </pluginGroups>
</settings>
```
## Configuring magnolia instance

### You will need to set up local runtime configuration file local-runtime/configs/runtime.properties
Since this file contains secrets it is added to .gitignore and never committed

You will need to copy the template file
* local-runtime/configs/runtime.properties.template

Into
* local-runtime/configs/runtime.properties

And then fill in necessary properties
* magnolia.license.owner -> license owner (usually email)
  magnolia.license.key -> license key
  workspace.home -> absolute path to folder with this project .

**IMPORTANT** ON Windows environments the path must use opposite slashes than "normal" for windows.
Examples
* Windows: workspace.home: C:/users/tsgolebiowski/dev/insights-accelerator
* Linux: workspace.home: /home/tsgolebiowski/dev/insights-accelerator

### 5. Run Maven Command
After setting up the repository and the dependency in your pom.xml, you can run the Maven build command to download the artifact:

### Run
Once all above configurations are done, execute the following to start magnolia
```shell
mvn clean install
cd magnolia63-webapp
mvn initialize cargo:run
```

Maven will authenticate with GitHub Packages using your provided credentials and download the artifact to your local repository.

After startup magnolia will be available under:
http://localhost:8080/magnoliaAuthor

Credentials to log in are
* **user**: superuser
* **password**: superuser

### Logs
Log files are available under local-runtime/tomcat-logs
* tomcat-author.log -> main log file
* cargo-author.log -> cargo plugin log, useful when tomcat is not starting

### War for full deployment
* Full war file is available under
  magnolia63-webapp/target/magnolia63-webapp-6.3.0-SNAPSHOT.war

________________________________________
### Troubleshooting
*	**Authentication Issues** : If you encounter issues during authentication, ensure your token has the correct scopes and is correctly placed in the settings.xml file.
*	**Artifact Not Found**: Ensure the artifact exists in the GitHub Packages repository and the correct version is specified in your pom.xml.