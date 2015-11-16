@focus
Feature: Single user focuses

  Scenario: Creating anonymous account for first user works
    Given I am a new user
    When Alice goes to "/"
    And Alice should not be logged in
    Then Alice goes to "/focus"
    And Alice should be logged in
    And Alice should see her name in navbar

  Scenario: New team is public by default
    Given I am a new user
    When Alice goes to "/focus"
    Then Alice should see her team as public

  Scenario: Make team private
    Given I am a new user
    When Alice goes to "/focus"
    And Alice checks the private checkbox
    Then Alice should see her team as private