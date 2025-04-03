-- CreateTable
CREATE TABLE "brokers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "creci" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "company" VARCHAR,
    "phone" VARCHAR,
    "email" VARCHAR,
    "avatar" TEXT,

    CONSTRAINT "brokers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" VARCHAR NOT NULL DEFAULT nextval('properties_id_seq'::regclass),
    "location" VARCHAR(255) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "broker_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR NOT NULL,
    "area" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "suites" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" INTEGER NOT NULL DEFAULT 0,
    "parking" INTEGER NOT NULL DEFAULT 0,
    "year" INTEGER,
    "iptu" DECIMAL(10,2),
    "sold" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "amenities" TEXT,
    "images" TEXT[],
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'disponível',

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brokers_creci_key" ON "brokers"("creci");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "brokers"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
