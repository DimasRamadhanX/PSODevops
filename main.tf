variable "credentials" {}
variable "project" {}
variable "region" {
  default = "asia-southeast2"
}

provider "google" {
  credentials = file(var.credentials)
  project     = var.project
  region      = var.region
}

resource "google_storage_bucket" "static" {
  name     = "${var.project}-static-bucket"
  location = variable "credentials" {}
variable "project" {}
variable "region" {
  default = "asia-southeast2"
}

variable "create_bucket" {
  type    = bool
  default = true
}

provider "google" {
  credentials = file(var.credentials)
  project     = var.project
  region      = var.region
}

resource "google_storage_bucket" "static" {
  count    = var.create_bucket ? 1 : 0
  name     = "${var.project}-static-bucket"
  location = var.region
}
var.region
}
