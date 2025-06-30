import { defineBackend } from "@aws-amplify/backend";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CfnMap, CfnPlaceIndex, CfnGeofenceCollection } from "aws-cdk-lib/aws-location";
import { Stack } from "aws-cdk-lib";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
});

// creating new personalized stack
const geoStack = backend.createStack("myGeoStack");

// creating a location services map using L1 construct
const map = new CfnMap(geoStack, 'MyTestMap', {
  mapName: 'MyTestMap',
  configuration: {
    style: 'VectorEsriStreets',
  },
  description: 'A test map for my application',
  pricingPlan: 'RequestBasedUsage',
});

// forming an IAM policy statment to give Map access to ALS APIs
const myGeoPolicy = new Policy(geoStack, 'MyGeoPolicy', {
  policyName: 'MyGeoPolicy',
  statements: [
    new PolicyStatement({
      actions: [
        'geo:GetMapStyleDescriptor',
        'geo:GetMapTile',
        'geo:GetMapSprites',
        'geo:GetMapGlyphs',
      ],
      resources: [map.attrMapArn],
    }),
  ],
});

// adding geo policy to both authenticated and unauthenticated user IAM roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(myGeoPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(myGeoPolicy);

// creating a location services place index
const myNewIndex = new CfnPlaceIndex(geoStack, 'MyNewPlaceIndex', {
  dataSource: "Here",
  dataSourceConfiguration: {
    intendedUse: "SingleUse", // this can be "SingleUse" or "Storage" suggesting that these results might be stored in a database or
  },
  indexName: "MyNewPlaceIndex",
  pricingPlan: "RequestBasedUsage",
  tags: [
    {
      key: "MyTagKey",
      value: "MyTagValue",
    },
  ]
});

// creating policy for allowing access to Place Index APIs
const myPlaceIndexPolicy = new Policy(geoStack, 'MyPlaceIndexPolicy', {
  policyName: 'MyPlaceIndexPolicy',
  statements: [
    new PolicyStatement({
      actions: [
        'geo:SearchPlaceIndexForPosition',
        'geo:SearchPlaceIndexForText',
        'geo:SearchPlaceIndexForSuggestions',
        'geo:GetPlace',
      ],
      resources: [myNewIndex.attrIndexArn],
    }),
  ],
});

backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(myPlaceIndexPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(myPlaceIndexPolicy);


// creating geofence service
const myGeofenceCollection = new CfnGeofenceCollection(geoStack, 'MyGeofenceCollection', {
  collectionName: 'MyGeofenceCollection',
  pricingPlan: 'RequestBasedUsage',
  tags: [
    {
      key: "MyGeofenceTagKey",
      value: "MyGeofenceTagValue",
    },
  ]
});

// creating IAM policy for geofence collections
const myGeofenceCollectionPolicy = new Policy(geoStack, 'MyGeofenceCollectionPolicy', {
  policyName: 'MyGeofenceCollectionPolicy',
  statements: [
    new PolicyStatement({
      actions: [
        'geo:BatchPutGeofence',
        'geo:BatchDeleteGeofence',
        'geo:DeleteGeofence',
        'geo:GetGeofence',
        'geo:ListGeofences',
        'geo:PutGeofence',
      ],
      resources: [myGeofenceCollection.attrCollectionArn],
    }),
  ],
});

backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(myGeofenceCollectionPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(myGeofenceCollectionPolicy);

backend.addOutput({
  geo: {
    aws_region: geoStack.region,
    maps: {
      items : {
        [map.mapName]: {
          style: "VectorEsriNavigation",
        },
      },
      default: map.mapName,
    },
    search_indices: {
      default: myNewIndex.indexName,
      items: [myNewIndex.indexName],
    },
    geofence_collections: {
      default: myGeofenceCollection.collectionName,
      items: [myGeofenceCollection.collectionName],
    },
  },
});