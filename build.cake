#addin nuget:?package=Cake.Npm&version=0.17.0
#addin nuget:?package=Cake.Json&version=4.0.0
#addin nuget:?package=Newtonsoft.Json&version=12.0.3

var target = Argument("target", "BuildFront");

var authority = Argument("authority", "http://127.0.0.1.xip.io:5501");
var clientId = Argument("clientId", "itlab_spa");
var redirectUri = Argument("redirectUri", "http://127.0.0.1.xip.io:5500/logincallback");
var responseType = Argument("responseType", "code");
var scope = Argument("scope", "openid profile roles itlab.events itlab.projects itlab.salary itlab.reports");
var postLogOutRedirectUrl = Argument("postLogOutRedirectUrl", "http://127.0.0.1.xip.io:5500");
var silentRedirectUrl = Argument("silentRedirectUrl", "http://127.0.0.1.xip.io:5500/silentcallback");
var vkGroupDIalogUrl = Argument("vkGroupDIalogUrl", "https://vk.com/rtuitlab");
var filesBaseAddress  = Argument("filesBaseAddress", "http://127.0.0.1.xip.io:5500");

var frontPublishDir = "deploy/ITLab-Front";
var appsettingsPath = "public/config.json";
Setup(ctx =>
{
   CleanDirectory(frontPublishDir);
});

Teardown(ctx =>
{
});

var appSettings = new {
   VUE_APP_AUTHORITY = authority,
   VUE_APP_CLIENT_ID = clientId,
   VUE_APP_REDIRECT_URI = redirectUri,
   VUE_APP_RESPONSE_TYPE = responseType,
   VUE_APP_SCOPE = scope,
   VUE_APP_POST_LOGOUT_REDIRECT_URL = postLogOutRedirectUrl,
   VUE_APP_SILENT_REDIRECT_URI = silentRedirectUrl,
   VUE_APP_VK_GROUP_DIALOG_URL = vkGroupDIalogUrl,
   VUE_APP_FILES_BASE_ADDRESS = filesBaseAddress
};


Task("GenAppSettings")
   .Does(() =>
{
   if (FileExists(appsettingsPath))
   {
       if (!HasArgument("rewriteConfig"))
       {
          throw new Exception($"file {appsettingsPath} exists, use '--rewriteConfig' argument to rewrite existing file");
       }
   }
   SerializeJsonToPrettyFile("public/config.json", appSettings);
});

Task("NpmCI")
   .Does(() => 
{
   NpmCi();
});

Task("BuildFront")
   .IsDependentOn("NpmCI")
   .Does(() =>
{
   NpmRunScript("build");

   CopyDirectory("dist", frontPublishDir);
});


RunTarget(target);