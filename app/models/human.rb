class Human < ActiveRecord::Base
  belongs_to :dept
  has_many :salary_histories
  has_many :interview_histories
  has_many :employment_histories
  validates_inclusion_of :gender, :in => Settings.genders, :message => "woah! what are you then!??!!"
  validates_inclusion_of :marriage_state, :in => Settings.marriage_status, :message => "please specify marriage state"
  validates_inclusion_of :employment_state, :in => Settings.employment_status
  
  acts_as_authentic do |c|
    c.require_password_confirmation = false
    c.validate_email_field = false
    c.validates_length_of_password_field_options = { :minimum => 1, :if => :should_validate? }
    c.ignore_blank_passwords = true
  end
  
  attr_accessor :updating_password

  def should_validate?
    updating_password or new_record?
  end
  
  def manager?
    return false if dept == nil
    id == dept.manager_id
  end
  
  def set_manager
    return if dept == nil
    dept.update_attributes(:manager_id => id)
  end

  def log_creation
    return if id == nil
    h = History.new
    h.human_id = id
    h.category = 'profile'
    h.log = "created"
    h.save
  end

end
