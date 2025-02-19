/*
  # Create organizations and admin management tables

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)
      - `created_by` (uuid, references auth.users)
      - `active` (boolean)
    
    - `organization_admins`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references organizations)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `created_by` (uuid, references auth.users)
      - `active` (boolean)

  2. Security
    - Enable RLS on both tables
    - Add policies for super admin access
    - Add policies for admin access to their own organization
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  active boolean DEFAULT true
);

-- Create organization_admins table
CREATE TABLE IF NOT EXISTS organization_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  active boolean DEFAULT true,
  UNIQUE(organization_id, user_id)
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_admins ENABLE ROW LEVEL SECURITY;

-- Policies for organizations table
CREATE POLICY "Super admins can manage organizations"
  ON organizations
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'super-admin');

CREATE POLICY "Admins can view their organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_admins
      WHERE organization_id = organizations.id
      AND user_id = auth.uid()
      AND active = true
    )
  );

-- Policies for organization_admins table
CREATE POLICY "Super admins can manage organization admins"
  ON organization_admins
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'super-admin');

CREATE POLICY "Admins can view their organization's admins"
  ON organization_admins
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organizations o
      JOIN organization_admins oa ON o.id = oa.organization_id
      WHERE o.id = organization_admins.organization_id
      AND oa.user_id = auth.uid()
      AND oa.active = true
    )
  );
