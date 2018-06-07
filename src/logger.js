import winston from 'winston';
const { combine, timestamp, prettyPrint } = winston.format;

/*
 * Winston is a logging service which serves provide logging services through multiple transports.
 * 
 * Below will be documented all the required information, to dissemninate the learning curve. 
 * 
 * All information is gleaned from:
 * https://github.com/winstonjs/winston
 */


 /*
   Winston offers a default logger accessible through the require statement - however, best practice is to
   create your own logger. 
  
      level:
        Wintston operates on a scale of severity - error, warning, info, debug, and silly.
        Setting a level will mean this service will log that level and above.

      format:
        A way for winston to format the information heading out. Stylization, basically.
        Many of the formats are offered for free, and combined using format.combine.

      transports:
        A transport is a way for Wintston to communicate information. Winston offers come core transports:
        console, file, and http. It is possible to have multiple loggers, all with custom levels, formats, etc.
      
  */ 
const logger = winston.createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [
    new winston.transports.Console(),
  ],
  exitOnError: false // Do not exit the application when an error message occurs.
})


export default logger;