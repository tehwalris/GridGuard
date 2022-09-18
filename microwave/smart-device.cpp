#include "FastLED.h"
#include <WiFi.h>

#define LED_PIN 17
#define LED_COUNT 62

const int buttonPin = 22;

// Replace with your network credentials
const char *ssid = "walrus";
const char *password = "walruc123";

// Set web server port number to 80
WiFiServer server(80);

const long timeoutTime = 1000;
const int maxMessageLength = 50;

bool buttonWasPressed = false;

CRGB leds[LED_COUNT];

void setSolidColor(bool on)
{
  int onPixelCount = 16;

  CRGB mainColor = CRGB::Black;
  if (on)
  {
    // mainColor.setRGB(0x9c, 0x60, 0x00);
    mainColor.setRGB(255, 96, 0);
  }
  for (int i = 0; i < LED_COUNT; i++)
  {
    leds[i] = (i >= LED_COUNT - onPixelCount) ? mainColor : CRGB::Black;
  }
  FastLED.show();
}

void setup()
{
  Serial.begin(115200);

  pinMode(buttonPin, INPUT);

  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  FastLED.addLeds<NEOPIXEL, LED_PIN>(leds, LED_COUNT);
  setSolidColor(true);
  delay(100);
  setSolidColor(false);

  server.begin();
}

void loop()
{
  bool buttonIsPressed = digitalRead(buttonPin) == LOW;
  buttonWasPressed = buttonWasPressed || buttonIsPressed;

  WiFiClient client = server.available();
  if (!client)
  {
    return;
  }

  char message[maxMessageLength + 1] = {};
  unsigned int messageLength = 0;
  unsigned long messageStartTime = millis();
  while (client.connected() && messageLength < maxMessageLength && millis() - messageStartTime < timeoutTime)
  {
    if (!client.available())
    {
      continue;
    }
    char c = client.read();
    if (c == '\n')
    {
      break;
    }
    message[messageLength] = c;
    messageLength++;
  }

  if (strcmp(message, "on") == 0)
  {
    setSolidColor(true);
  }
  else if (strcmp(message, "off") == 0)
  {
    setSolidColor(false);
  }
  else
  {
    Serial.println("unknown command");
    Serial.println(message);
  }

  if (buttonWasPressed && !buttonIsPressed)
  {
    client.write('t');
    buttonWasPressed = false;
  }
  else
  {
    client.write('f');
  }

  client.stop();
}