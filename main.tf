variable "credentials" {
  description = "Path ke service account JSON file"
  type        = string
}

variable "project" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "asia-southeast2"
}

variable "create_bucket" {
  description = "Apakah bucket ingin dibuat?"
  type        = bool
  default     = true
}

# Membuat timestamp unik untuk nama bucket
locals {
  unique_suffix = substr(md5(timestamp()), 0, 6)
}

provider "google" {
  credentials = file(var.credentials)
  project     = var.project
  region      = var.region
}

resource "google_storage_bucket" "static" {
  count    = var.create_bucket ? 1 : 0
  name     = "${var.project}-static-bucket-${local.unique_suffix}"
  location = var.region

  # Opsional: set storage class dan akses level sesuai kebutuhan
  storage_class = "STANDARD"
  uniform_bucket_level_access = true
}
