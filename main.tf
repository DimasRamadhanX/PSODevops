provider "google" {
  credentials = var.credentials
  project     = var.project
  region      = var.region
}

variable "credentials" {}
variable "project" {}
variable "region" {
  default = "asia-southeast2"
}

resource "google_storage_bucket" "static" {
  name     = "${var.project}-static-bucket"
  location = var.region

  # Tambahan: cegah destroy dan error apply
  lifecycle {
    prevent_destroy = true
  }
}
