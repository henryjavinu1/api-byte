-- CREATE DATABESE
CREATE DATABASE IF NOT EXISTS DemoByte;
USE DemoByte;

-- Table Person
CREATE TABLE IF NOT EXISTS Person (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    NIT VARCHAR(10) UNIQUE NOT NULL,
    Name VARCHAR(60) NOT NULL,
    Address VARCHAR(100),
    Phone_Number VARCHAR(16)
);

-- Table Educational_Credentials
CREATE TABLE IF NOT EXISTS Educational_Credentials (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    Person_ID BIGINT NOT NULL,
    Type VARCHAR(10),
    Organization VARCHAR(60),
    Acquired_credential VARCHAR(100),
    Year INT,
    FOREIGN KEY (Person_ID) REFERENCES Person(ID)
);
