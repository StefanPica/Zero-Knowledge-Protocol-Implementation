# ZeroRental

ZeroRental is a web app. A landlord uses it to check a tenant. The landlord checks if the tenant has money for rent. The landlord does not see the bank balance. The app uses Zero-Knowledge Proofs.

## Features

* The tenant proves they meet the limit. The number is hidden.
* The app has Groth16 and PLONK. The user clicks one.
* The math runs in the browser.
* Landlords have a page. Tenants have a page.
* The page is black and white.

## Technology

### Cryptography
* Circom
* SnarkJS
* Groth16 and PLONK
* WebAssembly (WASM)

### Frontend
* React.js
* React Router
* Axios
* Bootstrap 5 and CSS

### Backend
* Java Spring Boot
* Spring Data JPA
* H2 Database

## How it works

1. Landlord sends a request with a limit.
2. Tenant logs in. Tenant types their balance in the browser.
3. Browser does math and makes a proof.
4. Browser sends the proof to the server. The browser does not send the balance.
5. Server checks the proof. Server tells the landlord the result.

## Setup

### Requirements
* Node.js
* Java
* Maven

