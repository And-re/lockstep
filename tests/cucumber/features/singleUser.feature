@focus
Feature: Single user focuses

  Scenario: Creating anonymous account for first user works
    Given There is one user
    When Alice goes to "/"
    And Alice should not be logged in
    Then Alice goes to "/focus"
    And Alice should be logged in
    And Alice should see her name in navbar

  Scenario: New team is public by default
    Then Alice should see the team is not private

  Scenario: Make team private
    Then Alice checks the private checkbox
    And Alice should see the team is private